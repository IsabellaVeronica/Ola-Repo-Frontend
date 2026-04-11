import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, ArrowUpRight, ArrowDownRight, LayoutDashboard, History, Settings2, PlusCircle, CreditCard, Wallet } from 'lucide-react';
import { MoneyDashboard } from './MoneyDashboard';
import { MoneyMovements } from './MoneyMovements';
import { MoneySettings } from './MoneySettings';
import { ManualExpenseForm } from './ManualExpenseForm';
import { Button } from "@/components/ui/button";

export const MoneyManager: React.FC = () => {
    const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
                        <Wallet className="h-10 w-10 text-primary" />
                        Dinero & Finanzas
                    </h2>
                    <p className="text-muted-foreground font-medium mt-1">
                        Control total de ingresos, gastos y rentabilidad real del negocio.
                    </p>
                </div>
                <Button 
                    onClick={() => setIsExpenseFormOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-full px-6 font-bold uppercase tracking-wider text-xs flex items-center gap-2"
                >
                    <PlusCircle className="h-4 w-4" />
                    Registrar Gasto
                </Button>
            </div>

            <Tabs defaultValue="dashboard" className="w-full space-y-6">
                <TabsList className="bg-muted/50 p-1 rounded-xl border border-border/40">
                    <TabsTrigger value="dashboard" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                        <LayoutDashboard className="h-4 w-4" /> Resumen General
                    </TabsTrigger>
                    <TabsTrigger value="movements" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                        <History className="h-4 w-4" /> Historial de Caja
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                        <Settings2 className="h-4 w-4" /> Configuración técnica
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard">
                    <MoneyDashboard />
                </TabsContent>

                <TabsContent value="movements">
                    <MoneyMovements />
                </TabsContent>

                <TabsContent value="settings">
                    <MoneySettings />
                </TabsContent>
            </Tabs>

            <ManualExpenseForm 
                isOpen={isExpenseFormOpen}
                onClose={() => setIsExpenseFormOpen(false)}
                onSuccess={() => {
                    // Force refresh components if needed (could use a shared state/emitter)
                    window.dispatchEvent(new CustomEvent('money-updated'));
                }}
            />
        </div>
    );
};
