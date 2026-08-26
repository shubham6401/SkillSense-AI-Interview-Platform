import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function ActionCard({ title, description, icon: Icon, path, badge }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(path)}
            className="group cursor-pointer bg-white border border-slate-200/90 rounded-3xl p-7 shadow-sm hover:shadow-md hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
        >
            <div>
                <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 border border-blue-100/60">
                        <Icon size={26} />
                    </div>
                    {badge && (
                        <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            {badge}
                        </span>
                    )}
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {description}
                </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-blue-600 group-hover:text-blue-700">
                <span>Launch Action</span>
                <ArrowRight size={15} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    );
}

export default ActionCard;