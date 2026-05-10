import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Package,
  RefreshCw,
  Download,
  FileSpreadsheet,
  Calendar
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '../lib/supabase';

interface OrderItem {
  product_id: string;
  product_name: string;
  variation_id: string | null;
  variation_name: string | null;
  quantity: number;
  price: number;
  total: number;
}

interface OrderRow {
  id: string;
  order_number: string | null;
  customer_name: string;
  order_items: OrderItem[];
  total_price: number;
  shipping_fee: number | null;
  discount_applied: number | null;
  order_status: string;
  payment_status: string;
  created_at: string;
}

interface CostMap {
  // Keyed by `${product_id}|${variation_id ?? ''}` -> unit raw cost
  [key: string]: number;
}

interface SalesAnalyticsProps {
  onBack: () => void;
}

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

const peso = (n: number) =>
  '₱' + (Math.round(n * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const startOf = (period: Period, ref: Date): Date => {
  const d = new Date(ref);
  d.setHours(0, 0, 0, 0);
  if (period === 'daily') return d;
  if (period === 'weekly') {
    const day = d.getDay(); // 0=Sun
    const diff = (day + 6) % 7; // make Monday the start
    d.setDate(d.getDate() - diff);
    return d;
  }
  if (period === 'monthly') {
    d.setDate(1);
    return d;
  }
  // yearly
  d.setMonth(0, 1);
  return d;
};

const previousRange = (period: Period, start: Date): { prevStart: Date; prevEnd: Date } => {
  const prevStart = new Date(start);
  const prevEnd = new Date(start);
  if (period === 'daily') prevStart.setDate(prevStart.getDate() - 1);
  if (period === 'weekly') prevStart.setDate(prevStart.getDate() - 7);
  if (period === 'monthly') prevStart.setMonth(prevStart.getMonth() - 1);
  if (period === 'yearly') prevStart.setFullYear(prevStart.getFullYear() - 1);
  return { prevStart, prevEnd };
};

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

const SalesAnalytics: React.FC<SalesAnalyticsProps> = ({ onBack }) => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [costs, setCosts] = useState<CostMap>({});
  const [loading, setLoading] = useState(true);

  const today = useMemo(() => new Date(), []);
  const [startDate, setStartDate] = useState<string>(isoDate(startOf('monthly', today)));
  const [endDate, setEndDate] = useState<string>(isoDate(today));
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'completed'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes, variationsRes] = await Promise.all([
        supabase
          .from('orders')
          .select('id, order_number, customer_name, order_items, total_price, shipping_fee, discount_applied, order_status, payment_status, created_at')
          .order('created_at', { ascending: false }),
        supabase.from('products').select('id, name, raw_cost, base_price'),
        supabase.from('product_variations').select('id, product_id, raw_cost, price')
      ]);

      if (ordersRes.error) throw ordersRes.error;

      const map: CostMap = {};
      (productsRes.data || []).forEach((p: any) => {
        map[`${p.id}|`] = Number(p.raw_cost) || 0;
      });
      (variationsRes.data || []).forEach((v: any) => {
        map[`${v.product_id}|${v.id}`] = Number(v.raw_cost) || 0;
      });

      setOrders((ordersRes.data || []) as OrderRow[]);
      setCosts(map);
    } catch (e) {
      console.error('Analytics load error:', e);
      alert('Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  const lookupCost = (item: OrderItem): number => {
    const key = `${item.product_id}|${item.variation_id ?? ''}`;
    if (key in costs) return costs[key];
    // fall back to product-level cost if variation missing
    const fallback = costs[`${item.product_id}|`];
    return fallback ?? 0;
  };

  const orderGross = (o: OrderRow) =>
    (o.order_items || []).reduce((s, i) => s + Number(i.total || i.price * i.quantity || 0), 0);

  const orderCost = (o: OrderRow) =>
    (o.order_items || []).reduce((s, i) => s + lookupCost(i) * Number(i.quantity || 0), 0);

  const orderInRange = (o: OrderRow, from: Date, to: Date) => {
    const ts = new Date(o.created_at).getTime();
    return ts >= from.getTime() && ts <= to.getTime();
  };

  const matchesStatus = (o: OrderRow) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'paid') return o.payment_status === 'paid' || o.payment_status === 'confirmed';
    if (statusFilter === 'completed') return o.order_status === 'completed' || o.order_status === 'delivered';
    return true;
  };

  const periodTotals = (period: Period) => {
    const start = startOf(period, today);
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);
    const { prevStart, prevEnd } = previousRange(period, start);
    prevEnd.setMilliseconds(prevEnd.getMilliseconds() - 1);

    const cur = orders.filter(o => matchesStatus(o) && orderInRange(o, start, end));
    const prev = orders.filter(o => matchesStatus(o) && orderInRange(o, prevStart, prevEnd));

    const sum = (arr: OrderRow[]) => arr.reduce((s, o) => s + orderGross(o), 0);
    const curTotal = sum(cur);
    const prevTotal = sum(prev);
    const change = prevTotal === 0 ? (curTotal === 0 ? 0 : 100) : ((curTotal - prevTotal) / prevTotal) * 100;
    return { curTotal, prevTotal, change, count: cur.length };
  };

  const yearly = periodTotals('yearly');
  const monthly = periodTotals('monthly');
  const weekly = periodTotals('weekly');
  const daily = periodTotals('daily');

  const rangeStart = useMemo(() => {
    const d = new Date(startDate);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [startDate]);
  const rangeEnd = useMemo(() => {
    const d = new Date(endDate);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [endDate]);

  const filteredOrders = useMemo(
    () => orders.filter(o => matchesStatus(o) && orderInRange(o, rangeStart, rangeEnd)),
    [orders, rangeStart, rangeEnd, statusFilter, costs]
  );

  const totals = useMemo(() => {
    let gross = 0;
    let net = 0; // raw cost basis per spec
    let shipping = 0;
    let discount = 0;
    filteredOrders.forEach(o => {
      gross += orderGross(o);
      net += orderCost(o);
      shipping += Number(o.shipping_fee || 0);
      discount += Number(o.discount_applied || 0);
    });
    const profit = gross - net;
    const margin = gross > 0 ? (profit / gross) * 100 : 0;
    return {
      gross,
      net,
      profit,
      margin,
      shipping,
      discount,
      orderCount: filteredOrders.length
    };
  }, [filteredOrders, costs]);

  const topProducts = useMemo(() => {
    const acc: Record<string, { name: string; qty: number; gross: number; cost: number }> = {};
    filteredOrders.forEach(o => {
      (o.order_items || []).forEach(i => {
        const label = i.variation_name ? `${i.product_name} — ${i.variation_name}` : i.product_name;
        if (!acc[label]) acc[label] = { name: label, qty: 0, gross: 0, cost: 0 };
        acc[label].qty += Number(i.quantity || 0);
        acc[label].gross += Number(i.total || i.price * i.quantity || 0);
        acc[label].cost += lookupCost(i) * Number(i.quantity || 0);
      });
    });
    return Object.values(acc)
      .map(p => ({ ...p, profit: p.gross - p.cost }))
      .sort((a, b) => b.gross - a.gross)
      .slice(0, 10);
  }, [filteredOrders, costs]);

  const setQuickRange = (period: Period) => {
    const start = startOf(period, today);
    setStartDate(isoDate(start));
    setEndDate(isoDate(today));
  };

  const exportRows = () => {
    return filteredOrders.map(o => {
      const gross = orderGross(o);
      const cost = orderCost(o);
      return {
        'Order #': o.order_number || o.id.slice(0, 8),
        Date: new Date(o.created_at).toLocaleString(),
        Customer: o.customer_name,
        Items: (o.order_items || []).map(i => `${i.product_name}${i.variation_name ? ` (${i.variation_name})` : ''} x${i.quantity}`).join('; '),
        'Gross Sales': Math.round(gross * 100) / 100,
        'Raw Cost (Net)': Math.round(cost * 100) / 100,
        Profit: Math.round((gross - cost) * 100) / 100,
        'Shipping Fee': Number(o.shipping_fee || 0),
        Discount: Number(o.discount_applied || 0),
        'Order Status': o.order_status,
        'Payment Status': o.payment_status
      };
    });
  };

  const exportCSV = () => {
    const rows = exportRows();
    if (rows.length === 0) {
      alert('No orders in the selected range.');
      return;
    }
    const headers = Object.keys(rows[0]);
    const escape = (v: any) => {
      const s = String(v ?? '');
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [headers.join(','), ...rows.map(r => headers.map(h => escape((r as any)[h])).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${startDate}-to-${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportXLSX = () => {
    const rows = exportRows();
    if (rows.length === 0) {
      alert('No orders in the selected range.');
      return;
    }
    const summary = [
      { Metric: 'Date Range', Value: `${startDate} to ${endDate}` },
      { Metric: 'Orders', Value: totals.orderCount },
      { Metric: 'Gross Sales', Value: totals.gross },
      { Metric: 'Raw Cost (Net)', Value: totals.net },
      { Metric: 'Profit', Value: totals.profit },
      { Metric: 'Margin %', Value: Math.round(totals.margin * 100) / 100 },
      { Metric: 'Shipping Fees', Value: totals.shipping },
      { Metric: 'Discounts', Value: totals.discount }
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), 'Summary');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Orders');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(topProducts), 'Top Products');
    XLSX.writeFile(wb, `sales-report-${startDate}-to-${endDate}.xlsx`);
  };

  const KPI = ({
    label,
    value,
    change,
    count
  }: {
    label: string;
    value: number;
    change: number;
    count?: number;
  }) => {
    const up = change >= 0;
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
          <span
            className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded ${
              up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change).toFixed(1)}%
          </span>
        </div>
        <div className="mt-2 text-2xl font-bold text-gray-900">{peso(value)}</div>
        {typeof count === 'number' && (
          <div className="mt-1 text-xs text-gray-500">{count} order{count === 1 ? '' : 's'}</div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>
          <h1 className="text-base sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Sales Analytics
          </h1>
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
        {/* KPI grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KPI label="Today" value={daily.curTotal} change={daily.change} count={daily.count} />
          <KPI label="This Week" value={weekly.curTotal} change={weekly.change} count={weekly.count} />
          <KPI label="This Month" value={monthly.curTotal} change={monthly.change} count={monthly.count} />
          <KPI label="This Year" value={yearly.curTotal} change={yearly.change} count={yearly.count} />
        </div>

        {/* Filter / Export bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-end gap-3">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">From</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">To</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black"
                >
                  <option value="all">All Orders</option>
                  <option value="paid">Paid / Confirmed</option>
                  <option value="completed">Completed / Delivered</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setQuickRange('daily')} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold">Today</button>
              <button onClick={() => setQuickRange('weekly')} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold">Week</button>
              <button onClick={() => setQuickRange('monthly')} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold">Month</button>
              <button onClick={() => setQuickRange('yearly')} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold">Year</button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 justify-end">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-sm"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button
              onClick={exportXLSX}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export Excel
            </button>
          </div>
        </div>

        {/* Range totals */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase">
              <ShoppingBag className="w-4 h-4" /> Gross Sales
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-2">{peso(totals.gross)}</div>
            <div className="text-xs text-gray-500 mt-1">Selling price total</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase">
              <Package className="w-4 h-4" /> Raw Cost (Net)
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-2">{peso(totals.net)}</div>
            <div className="text-xs text-gray-500 mt-1">Cost of goods sold</div>
          </div>
          <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase">
              <TrendingUp className="w-4 h-4" /> Profit
            </div>
            <div className="text-2xl font-bold text-emerald-700 mt-2">{peso(totals.profit)}</div>
            <div className="text-xs text-emerald-700 mt-1">Margin {totals.margin.toFixed(1)}%</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase">
              <Calendar className="w-4 h-4" /> Orders
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-2">{totals.orderCount}</div>
            <div className="text-xs text-gray-500 mt-1">In selected range</div>
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-sm font-bold text-gray-900">Top Products (by gross sales)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Product</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Qty</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Gross</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Cost</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Profit</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-400 text-sm">
                      No sales in this range.
                    </td>
                  </tr>
                ) : (
                  topProducts.map(p => (
                    <tr key={p.name} className="border-t border-gray-100">
                      <td className="px-4 py-2 text-gray-900">{p.name}</td>
                      <td className="px-4 py-2 text-right text-gray-700">{p.qty}</td>
                      <td className="px-4 py-2 text-right text-gray-900 font-semibold">{peso(p.gross)}</td>
                      <td className="px-4 py-2 text-right text-gray-700">{peso(p.cost)}</td>
                      <td className="px-4 py-2 text-right text-emerald-700 font-semibold">{peso(p.profit)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Orders detail */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">Orders in Range</h2>
            <span className="text-xs text-gray-500">{filteredOrders.length} order(s)</span>
          </div>
          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Order #</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Customer</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Gross</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Cost</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Profit</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                      No orders in this range.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(o => {
                    const gross = orderGross(o);
                    const cost = orderCost(o);
                    return (
                      <tr key={o.id} className="border-t border-gray-100">
                        <td className="px-4 py-2 text-gray-900 font-mono text-xs">{o.order_number || o.id.slice(0, 8)}</td>
                        <td className="px-4 py-2 text-gray-700 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-gray-900">{o.customer_name}</td>
                        <td className="px-4 py-2 text-right text-gray-900">{peso(gross)}</td>
                        <td className="px-4 py-2 text-right text-gray-700">{peso(cost)}</td>
                        <td className="px-4 py-2 text-right text-emerald-700 font-semibold">{peso(gross - cost)}</td>
                        <td className="px-4 py-2 text-xs">
                          <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-700">{o.order_status}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
