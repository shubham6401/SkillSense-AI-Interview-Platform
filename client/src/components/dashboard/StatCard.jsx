import { TrendingUp } from "lucide-react";

function StatCard({ title, value, subtitle, icon: Icon = TrendingUp, color = "blue" }) {
    const colorStyles = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        rose: "bg-rose-50 text-rose-600 border-rose-100",
    };

    const iconStyle = colorStyles[color] || colorStyles.blue;

    return (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase font-bold tracking-wider text-slate-400">
                    {title}
                </p>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${iconStyle}`}>
                    <Icon size={20} />
                </div>
            </div>

            <div className="mt-4">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {value}
                </h2>
                {subtitle && (
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}

export default StatCard;