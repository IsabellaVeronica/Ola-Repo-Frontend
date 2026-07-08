import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingDown, Plus, Tags, Calendar, 
  Trash2, Search, ArrowUpRight, Check, X,
  Home, Wrench, Coins, Megaphone, Lightbulb, UserCheck, DollarSign, Edit
} from 'lucide-react';
import { format } from 'date-fns';

const ICONS = {
  home: Home,
  wrench: Wrench,
  coins: Coins,
  megaphone: Megaphone,
  lightbulb: Lightbulb,
  usercheck: UserCheck,
  dollar: DollarSign,
  tags: Tags
};

const COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500',
  'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-slate-500'
];

export default function GastosManager() {
  const [userRole, setUserRole] = useState('');
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        const role = parsed.roles?.[0] || parsed.role;
        setUserRole(role || '');
      } catch (e) {}
    }
  }, []);
  const [activeTab, setActiveTab] = useState<'historial' | 'categorias'>('historial');
  const [categorias, setCategorias] = useState<any[]>([]);
  const [gastos, setGastos] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>({ total_gastos: 0, max_gasto: 0 });
  const [distribution, setDistribution] = useState<any[]>([]);
  const [cuentas, setCuentas] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [showGastoModal, setShowGastoModal] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  useEffect(() => {
    fetchData();
    fetchCuentas();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, gastosRes, kpisRes] = await Promise.all([
        fetch('/api/gastos/categorias'),
        fetch('/api/gastos?limit=50'),
        fetch('/api/gastos/kpis')
      ]);
      if (catRes.ok) setCategorias(await catRes.json());
      if (gastosRes.ok) setGastos((await gastosRes.json()).data);
      if (kpisRes.ok) {
        const kData = await kpisRes.json();
        setKpis(kData.kpis);
        setDistribution(kData.distribution);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCuentas = async () => {
    try {
      const res = await fetch('/api/money/cuentas');
      if (res.ok) setCuentas(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnular = async (id: number) => {
    if (!confirm('¿Estás seguro de anular este gasto? El saldo se restituirá a la caja.')) return;
    try {
      const res = await fetch(`/api/gastos/${id}/anular`, { method: 'PATCH' });
      if (res.ok) {
        fetchData();
        fetchCuentas();
      } else {
        const data = await res.json().catch(()=>({}));
        alert(data.message || 'Error al anular');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  const handleDeleteCategoria = async (id: number) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      const res = await fetch(`/api/gastos/categorias/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {}
  };

  const filteredGastos = useMemo(() => {
    return gastos.filter(g => {
      const matchSearch = g.concepto.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = filterCategory === 'all' || g.id_expense_category?.toString() === filterCategory;
      return matchSearch && matchCat;
    });
  }, [gastos, searchTerm, filterCategory]);

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Gestión de Gastos
          </h2>
          <p className="text-gray-500">Controla los egresos, pagos operativos y clasificación de gastos.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowGastoModal(true)} className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 flex items-center gap-2 shadow-sm font-medium">
            <Plus className="h-4 w-4" /> Registrar Gasto
          </button>
          <button onClick={() => setShowCategoriaModal(true)} className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 flex items-center gap-2 shadow-sm font-medium">
            <Plus className="h-4 w-4 text-pink-500" /> Crear Categoría
          </button>
        </div>
      </div>

      <div className="flex gap-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('historial')}
          className={`pb-3 font-medium text-sm border-b-2 flex items-center gap-2 ${activeTab === 'historial' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <TrendingDown className="h-4 w-4" /> Historial de Gastos
        </button>
        <button
          onClick={() => setActiveTab('categorias')}
          className={`pb-3 font-medium text-sm border-b-2 flex items-center gap-2 ${activeTab === 'categorias' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Tags className="h-4 w-4" /> Categorías de Gastos
        </button>
      </div>

      {activeTab === 'historial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-pink-50 rounded-xl p-6 shadow-sm border border-pink-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-pink-600 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Gastos Totales (Filtro)</span>
                  <DollarSign className="h-4 w-4" />
                </div>
                <div className="text-4xl font-bold text-gray-900">${(kpis.total_gastos || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</div>
              </div>
              <p className="text-sm text-pink-700/80 mt-2">Acumulado en los gastos registrados.</p>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-blue-600 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Gasto Más Alto</span>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <div className="text-4xl font-bold text-gray-900">${(kpis.max_gasto || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</div>
              </div>
              <p className="text-sm text-blue-700/80 mt-2">Mayor egreso individual registrado.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Distribución de Gastos</span>
                <TrendingDown className="h-4 w-4 text-pink-400" />
              </div>
              <div className="space-y-3">
                {distribution.slice(0, 3).map((d: any, i: number) => {
                  const pct = kpis.total_gastos > 0 ? (d.monto_total / kpis.total_gastos) * 100 : 0;
                  return (
                    <div key={d.id_expense_category}>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-gray-700">{d.categoria_nombre}</span>
                        <span className="text-gray-900">${d.monto_total.toFixed(0)} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${d.categoria_metadata?.color || 'bg-gray-500'}`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-pink-100 p-2 rounded-lg text-pink-600"><TrendingDown className="h-5 w-5" /></div>
                <div>
                  <h3 className="font-bold text-gray-900">Listado de Gastos</h3>
                  <p className="text-xs text-gray-500">Controla y anula egresos operativos en tiempo real.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por concepto..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-pink-500 focus:border-pink-500 bg-white"
                >
                  <option value="all">Todas las Categorías</option>
                  {categorias.map(c => (
                    <option key={c.id_expense_category} value={c.id_expense_category}>{c.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <th className="p-4 font-medium">Categoría</th>
                    <th className="p-4 font-medium">Concepto</th>
                    <th className="p-4 font-medium">Cuenta</th>
                    <th className="p-4 font-medium">Monto USD</th>
                    <th className="p-4 font-medium">Tasa</th>
                    <th className="p-4 font-medium">Monto Real</th>
                    <th className="p-4 font-medium">Fecha</th>
                    <th className="p-4 font-medium text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredGastos.map(g => {
                    const Icon = ICONS[(g.categoria_metadata?.icon as keyof typeof ICONS) || 'tags'];
                    return (
                      <tr key={g.id_transaccion} className={`hover:bg-gray-50 ${g.anulado ? 'opacity-50' : ''}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-2 font-medium">
                            {g.id_expense_category ? (
                              <>
                                <Icon className={`h-4 w-4 ${g.categoria_metadata?.color?.replace('bg-', 'text-')}`} />
                                {g.categoria_nombre}
                              </>
                            ) : (
                              <span className="text-gray-400 italic">Sin categoría</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-gray-900 font-medium">{g.concepto}</td>
                        <td className="p-4 text-gray-500 font-medium">{g.cuenta_nombre} <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{g.cuenta_moneda}</span></td>
                        <td className="p-4 font-bold text-gray-900">${Number(g.monto_usd).toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                        <td className="p-4 text-gray-400">{Number(g.tasa_cambio).toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                        <td className="p-4 font-medium text-red-500">-{Number(g.monto_real).toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                        <td className="p-4 text-gray-500 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {format(new Date(g.created_at), 'yyyy-MM-dd')}</td>
                        <td className="p-4 text-center">
                          {!g.anulado && ['admin', 'manager'].includes(userRole) && (
                            <button onClick={() => handleAnular(g.id_transaccion)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Anular gasto">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                          {g.anulado && <span className="text-xs font-bold text-red-500 uppercase">Anulado</span>}
                        </td>
                      </tr>
                    )
                  })}
                  {filteredGastos.length === 0 && (
                    <tr><td colSpan={8} className="p-8 text-center text-gray-500">No se encontraron gastos.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'categorias' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias.map(c => {
            const Icon = ICONS[(c.metadata?.icon as keyof typeof ICONS) || 'tags'];
            return (
              <div key={c.id_expense_category} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative group overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`${c.metadata?.color || 'bg-gray-500'} bg-opacity-10 p-3 rounded-lg`}>
                      <Icon className={`h-6 w-6 ${c.metadata?.color?.replace('bg-', 'text-') || 'text-gray-500'}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{c.nombre}</h3>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider mt-0.5">
                        <div className={`w-2 h-2 rounded-full ${c.metadata?.color || 'bg-gray-500'}`}></div>
                        {c.metadata?.icon || 'Custom'}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteCategoria(c.id_expense_category)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-500">{c.metadata?.descripcion || 'Gasto operativo de la tienda.'}</p>
              </div>
            )
          })}
          
          <button onClick={() => setShowCategoriaModal(true)} className="border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600 transition-colors group h-full min-h-[140px]">
            <Plus className="h-8 w-8 mb-2 text-gray-400 group-hover:text-pink-500" />
            <span className="font-bold text-gray-700 group-hover:text-pink-700">Añadir Categoría de Gasto</span>
            <span className="text-xs mt-1 text-center opacity-80">Crea etiquetas personalizadas con su icono y color para clasificar gastos.</span>
          </button>
        </div>
      )}

      {showCategoriaModal && (
        <CrearCategoriaModal 
          onClose={() => setShowCategoriaModal(false)} 
          onSuccess={() => { setShowCategoriaModal(false); fetchData(); }} 
        />
      )}
      
      {showGastoModal && (
        <RegistrarGastoModal 
          categorias={categorias}
          cuentas={cuentas.filter(c => c.activo)}
          onClose={() => setShowGastoModal(false)}
          onSuccess={() => { setShowGastoModal(false); fetchData(); fetchCuentas(); }}
        />
      )}
    </div>
  );
}

function CrearCategoriaModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [icon, setIcon] = useState('tags');
  const [color, setColor] = useState(COLORS[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/gastos/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          metadata: { descripcion, icon, color }
        })
      });
      if (res.ok) onSuccess();
      else alert('Error al crear categoría');
    } catch (err) {
      alert('Error de red');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="bg-pink-100 p-1.5 rounded-lg text-pink-600"><Tags className="h-5 w-5" /></div>
            <div>
              <h3 className="font-bold text-gray-900 leading-tight">Crear Categoría de Gasto</h3>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mt-0.5">Establece un nombre, icono y color para identificar los gastos.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full shadow-sm border border-gray-100"><X className="h-4 w-4" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Nombre de Categoría *</label>
            <input required type="text" placeholder="Ej: Servicios, Alquiler, Sueldos" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-pink-500 focus:ring-pink-500 p-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Descripción</label>
            <input type="text" placeholder="Ej: Pago mensual de arriendo..." value={descripcion} onChange={e => setDescripcion(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-pink-500 focus:ring-pink-500 p-2.5 text-sm" />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Identificador / Icono *</label>
            <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
              {Object.entries(ICONS).map(([key, IconComp]) => (
                <button
                  key={key} type="button" onClick={() => setIcon(key)}
                  className={`p-2.5 rounded-md transition-all ${icon === key ? 'bg-pink-500 text-white shadow-md scale-110' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}
                >
                  <IconComp className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Color de Identificación *</label>
            <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
              {COLORS.map(c => (
                <button
                  key={c} type="button" onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full ${c} flex items-center justify-center transition-transform hover:scale-110 ${color === c ? 'ring-4 ring-pink-200 scale-110' : 'opacity-80'}`}
                >
                  {color === c && <Check className="h-4 w-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={submitting} className="px-5 py-2.5 text-sm font-bold text-white bg-pink-500 rounded-lg hover:bg-pink-600 shadow-sm disabled:opacity-50">Guardar Categoría</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RegistrarGastoModal({ categorias, cuentas, onClose, onSuccess }: { categorias: any[], cuentas: any[], onClose: () => void, onSuccess: () => void }) {
  const [idCategoria, setIdCategoria] = useState(categorias[0]?.id_expense_category || '');
  const [idCuenta, setIdCuenta] = useState(cuentas[0]?.id_cuenta || '');
  const [concepto, setConcepto] = useState('');
  const [montoUsd, setMontoUsd] = useState('');
  const [tasaCambio, setTasaCambio] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/gastos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_cuenta: Number(idCuenta),
          id_expense_category: idCategoria ? Number(idCategoria) : null,
          concepto,
          monto_usd: Number(montoUsd),
          tasa_cambio: tasaCambio ? Number(tasaCambio) : 1
        })
      });
      if (res.ok) onSuccess();
      else alert('Error al registrar gasto');
    } catch (err) {
      alert('Error de red');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="bg-pink-100 p-1.5 rounded-lg text-pink-600"><TrendingDown className="h-5 w-5" /></div>
            <div>
              <h3 className="font-bold text-gray-900 leading-tight">Registrar Gasto Operativo</h3>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mt-0.5">Descuenta dinero de caja y registra el egreso.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full shadow-sm border border-gray-100"><X className="h-4 w-4" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Concepto del Gasto *</label>
            <input required type="text" placeholder="Ej: Pago de Internet, Transporte..." value={concepto} onChange={e => setConcepto(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-pink-500 focus:ring-pink-500 p-2.5 text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Monto (USD) *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input required type="number" step="0.01" min="0.01" value={montoUsd} onChange={e => setMontoUsd(e.target.value)} className="w-full pl-7 border-gray-300 rounded-lg shadow-sm focus:border-pink-500 focus:ring-pink-500 p-2.5 text-sm font-bold text-gray-900" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Tasa de Cambio</label>
              <input type="number" step="0.01" min="1" placeholder="Ej: 36.5" value={tasaCambio} onChange={e => setTasaCambio(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-pink-500 focus:ring-pink-500 p-2.5 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Categoría</label>
            <select value={idCategoria} onChange={e => setIdCategoria(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-pink-500 focus:ring-pink-500 p-2.5 text-sm bg-white">
              <option value="">(Sin categoría)</option>
              {categorias.map(c => (
                <option key={c.id_expense_category} value={c.id_expense_category}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Cuenta de Origen (Caja) *</label>
            <select required value={idCuenta} onChange={e => setIdCuenta(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-pink-500 focus:ring-pink-500 p-2.5 text-sm bg-white font-medium">
              <option value="">Selecciona una cuenta</option>
              {cuentas.map(c => (
                <option key={c.id_cuenta} value={c.id_cuenta}>{c.nombre} (Saldo: {Number(c.saldo).toLocaleString('en-US',{minimumFractionDigits:2})} {c.moneda})</option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={submitting} className="px-5 py-2.5 text-sm font-bold text-white bg-pink-500 rounded-lg hover:bg-pink-600 shadow-sm disabled:opacity-50 flex items-center gap-2">
              <Check className="h-4 w-4" /> Registrar Gasto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
