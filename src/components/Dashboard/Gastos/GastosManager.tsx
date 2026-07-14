import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingDown, Plus, Tags, Calendar, 
  Trash2, Search, ArrowUpRight, Check, X,
  Home, Wrench, Coins, Megaphone, Lightbulb, UserCheck, DollarSign, Edit
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
        fetch('/api/gastos/categorias').catch(() => null),
        fetch('/api/gastos?limit=50').catch(() => null),
        fetch('/api/gastos/kpis').catch(() => null)
      ]);
      if (catRes?.ok) {
        const catData = await catRes.json().catch(() => []);
        setCategorias(Array.isArray(catData) ? catData : []);
      }
      if (gastosRes?.ok) {
        const gData = await gastosRes.json().catch(() => ({ data: [] }));
        setGastos(Array.isArray(gData?.data) ? gData.data : []);
      }
      if (kpisRes?.ok) {
        const kData = await kpisRes.json().catch(() => ({ kpis: { total_gastos: 0, max_gasto: 0 }, distribution: [] }));
        setKpis(kData?.kpis || { total_gastos: 0, max_gasto: 0 });
        setDistribution(Array.isArray(kData?.distribution) ? kData.distribution : []);
      }
    } catch (err) {
      console.error('fetchData error:', err);
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

  if (loading) return <div className="p-8 text-center text-muted-foreground">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
            <TrendingDown className="h-8 w-8 text-primary" />
            Gestión de Gastos
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Controla los egresos, pagos operativos y clasificación de gastos.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button 
            className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all text-xs h-11"
            onClick={() => setShowGastoModal(true)}
          >
            <Plus className="h-4 w-4" /> Registrar Gasto
          </Button>
          <Button 
            variant="outline"
            className="flex-1 sm:flex-none border-border text-foreground hover:bg-muted font-semibold rounded-xl gap-2 shadow-sm active:scale-95 transition-all text-xs h-11"
            onClick={() => setShowCategoriaModal(true)}
          >
            <Plus className="h-4 w-4 text-primary" /> Crear Categoría
          </Button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab('historial')}
          className={`pb-3 font-medium text-sm border-b-2 flex items-center gap-2 transition-colors ${activeTab === 'historial' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <TrendingDown className="h-4 w-4" /> Historial de Gastos
        </button>
        <button
          onClick={() => setActiveTab('categorias')}
          className={`pb-3 font-medium text-sm border-b-2 flex items-center gap-2 transition-colors ${activeTab === 'categorias' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <Tags className="h-4 w-4" /> Categorías de Gastos
        </button>
      </div>

      {activeTab === 'historial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold tracking-wider uppercase text-muted-foreground">Gastos Totales (Filtro)</CardTitle>
                <DollarSign className="h-5 w-5 opacity-70 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-foreground">
                  ${(kpis.total_gastos || 0).toLocaleString('en-US', {minimumFractionDigits:2})}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 font-medium">Acumulado en gastos</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold tracking-wider uppercase text-muted-foreground">Gasto Más Alto</CardTitle>
                <ArrowUpRight className="h-5 w-5 opacity-70 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-foreground">
                  ${(kpis.max_gasto || 0).toLocaleString('en-US', {minimumFractionDigits:2})}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 font-medium">Mayor egreso individual</p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-lg">
              <CardHeader className="pb-2 flex flex-row justify-between items-center space-y-0">
                <CardTitle className="text-sm font-bold tracking-wider uppercase text-muted-foreground">Distribución</CardTitle>
                <TrendingDown className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mt-2">
                  {distribution.slice(0, 3).map((d: any, i: number) => {
                    const pct = kpis.total_gastos > 0 ? (d.monto_total / kpis.total_gastos) * 100 : 0;
                    return (
                      <div key={d.id_expense_category}>
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="text-foreground">{d.categoria_nombre}</span>
                          <span className="text-foreground font-bold">${d.monto_total.toFixed(0)} ({pct.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${d.categoria_metadata?.color || 'bg-primary'}`} style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-lg">
            <div className="p-4 border-b border-border flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-lg text-primary"><TrendingDown className="h-5 w-5" /></div>
                <div>
                  <h3 className="font-bold text-foreground">Listado de Gastos</h3>
                  <p className="text-xs text-muted-foreground">Controla y anula egresos operativos en tiempo real.</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar por concepto..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9 h-10 w-[200px] lg:w-[250px]"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                  <tr className="bg-muted/50 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">
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
                <tbody className="divide-y divide-border text-sm">
                  {filteredGastos.map(g => {
                    const Icon = ICONS[(g.categoria_metadata?.icon as keyof typeof ICONS) || 'tags'];
                    return (
                      <tr key={g.id_transaccion} className={`hover:bg-muted/50 transition-colors ${g.anulado ? 'opacity-50' : ''}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-2 font-medium">
                            {g.id_expense_category ? (
                              <Badge variant="outline" className={`border-none bg-muted ${g.categoria_metadata?.color?.replace('bg-', 'text-')}`}>
                                <Icon className="h-3.5 w-3.5 mr-1" />
                                {g.categoria_nombre}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground italic text-xs">Sin categoría</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-foreground font-medium">{g.concepto}</td>
                        <td className="p-4 text-muted-foreground font-medium">{g.cuenta_nombre} <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{g.cuenta_moneda}</span></td>
                        <td className="p-4 font-bold text-foreground">${Number(g.monto_usd).toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                        <td className="p-4 text-muted-foreground">{Number(g.tasa_cambio).toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                        <td className="p-4 font-medium text-destructive">-{Number(g.monto_real).toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                        <td className="p-4 text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {format(new Date(g.created_at), 'yyyy-MM-dd')}</td>
                        <td className="p-4 text-center">
                          {!g.anulado && ['admin', 'manager'].includes(userRole) && (
                            <Button variant="ghost" size="icon" onClick={() => handleAnular(g.id_transaccion)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors" title="Anular gasto">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                          {g.anulado && <Badge variant="outline" className="text-destructive border-destructive">Anulado</Badge>}
                        </td>
                      </tr>
                    )
                  })}
                  {filteredGastos.length === 0 && (
                    <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No se encontraron gastos.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'categorias' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias.map(c => {
            const iconKey = (c.metadata?.icon as keyof typeof ICONS) || 'tags';
            const Icon = ICONS[iconKey] || Tags;
            return (
              <Card key={c.id_expense_category} className="bg-card p-6 rounded-xl shadow-sm border border-border relative group overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`bg-muted p-3 rounded-lg`}>
                      <Icon className={`h-6 w-6 ${c.metadata?.color?.replace('bg-', 'text-') || 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{c.nombre}</h3>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
                        <div className={`w-2 h-2 rounded-full ${c.metadata?.color || 'bg-muted-foreground'}`}></div>
                        {c.metadata?.icon || 'Custom'}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteCategoria(c.id_expense_category)} className="opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 transition-opacity">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{c.metadata?.descripcion || 'Gasto operativo de la tienda.'}</p>
              </Card>
            )
          })}
          
          <button onClick={() => setShowCategoriaModal(true)} className="border-2 border-dashed border-border bg-muted/30 rounded-xl p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-colors group h-full min-h-[140px]">
            <Plus className="h-8 w-8 mb-2 text-muted-foreground group-hover:text-primary" />
            <span className="font-bold text-foreground group-hover:text-primary">Añadir Categoría de Gasto</span>
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
      <Card className="w-full max-w-md shadow-2xl overflow-hidden border-border bg-card">
        <div className="p-5 border-b border-border flex justify-between items-center bg-muted/50">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-lg text-primary"><Tags className="h-5 w-5" /></div>
            <div>
              <h3 className="font-bold text-foreground leading-tight">Crear Categoría de Gasto</h3>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mt-0.5">Establece un nombre, icono y color para identificar los gastos.</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">Nombre de Categoría *</label>
            <Input required type="text" placeholder="Ej: Servicios, Alquiler, Sueldos" value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">Descripción</label>
            <Input type="text" placeholder="Ej: Pago mensual de arriendo..." value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">Identificador / Icono *</label>
            <div className="flex flex-wrap gap-2 p-3 border border-border rounded-lg bg-muted/30">
              {Object.entries(ICONS).map(([key, IconComp]) => (
                <button
                  key={key} type="button" onClick={() => setIcon(key)}
                  className={`p-2.5 rounded-md transition-all ${icon === key ? 'bg-primary text-primary-foreground shadow-md scale-110' : 'bg-background text-muted-foreground hover:bg-muted border border-border'}`}
                >
                  <IconComp className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">Color de Identificación *</label>
            <div className="flex flex-wrap gap-2 p-3 border border-border rounded-lg bg-muted/30">
              {COLORS.map(c => (
                <button
                  key={c} type="button" onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full ${c} flex items-center justify-center transition-transform hover:scale-110 ${color === c ? 'ring-4 ring-primary/40 scale-110' : 'opacity-80'}`}
                >
                  {color === c && <Check className="h-4 w-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={submitting} className="font-bold">Guardar Categoría</Button>
          </div>
        </form>
      </Card>
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
      <Card className="w-full max-w-md shadow-2xl overflow-hidden border-border bg-card">
        <div className="p-5 border-b border-border flex justify-between items-center bg-muted/50">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-lg text-primary"><TrendingDown className="h-5 w-5" /></div>
            <div>
              <h3 className="font-bold text-foreground leading-tight">Registrar Gasto Operativo</h3>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mt-0.5">Descuenta dinero de caja y registra el egreso.</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">Concepto del Gasto *</label>
            <Input required type="text" placeholder="Ej: Pago de Internet, Transporte..." value={concepto} onChange={e => setConcepto(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">Monto (USD) *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-muted-foreground sm:text-sm">$</span>
                </div>
                <Input required type="number" step="0.01" min="0.01" value={montoUsd} onChange={e => setMontoUsd(e.target.value)} className="pl-7 font-bold text-foreground" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">Tasa de Cambio</label>
              <Input type="number" step="0.01" min="1" placeholder="Ej: 36.5" value={tasaCambio} onChange={e => setTasaCambio(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">Categoría</label>
            <select value={idCategoria} onChange={e => setIdCategoria(e.target.value)} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="">(Sin categoría)</option>
              {categorias.map(c => (
                <option key={c.id_expense_category} value={c.id_expense_category}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">Cuenta de Origen (Caja) *</label>
            <select required value={idCuenta} onChange={e => setIdCuenta(e.target.value)} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-medium">
              <option value="">Selecciona una cuenta</option>
              {cuentas.map(c => (
                <option key={c.id_cuenta} value={c.id_cuenta}>{c.nombre} (Saldo: {Number(c.saldo).toLocaleString('en-US',{minimumFractionDigits:2})} {c.moneda})</option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={submitting} className="font-bold flex items-center gap-2">
              <Check className="h-4 w-4" /> Registrar Gasto
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
