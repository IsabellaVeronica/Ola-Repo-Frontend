import { InventoryReports } from '../Inventory/InventoryReports';
import { SalesProfitReports } from './SalesProfitReports';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const ReportsManagement = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground drop-shadow-sm">Panel de Inteligencia y Reportes</h1>
                <p className="text-foreground/70 font-medium hidden sm:block">Monitorea ingresos, costos de venta, ganancias de tu negocio, y la salud general de tu inventario.</p>
            </div>

            <Tabs defaultValue="sales" className="w-full">
                <TabsList className="bg-card/60 backdrop-blur-md border border-foreground/10 p-1 shadow-sm w-fit justify-start whitespace-nowrap mb-6">
                    <TabsTrigger value="sales" className="text-xs font-bold px-4 py-2">Ventas y Ganancias</TabsTrigger>
                    <TabsTrigger value="inventory" className="text-xs font-bold px-4 py-2">Inventario</TabsTrigger>
                </TabsList>
                
                <TabsContent value="sales" className="space-y-4">
                    <SalesProfitReports />
                </TabsContent>
                
                <TabsContent value="inventory" className="space-y-4">
                    <InventoryReports />
                </TabsContent>
            </Tabs>
        </div>
    );
};

