import ComboCard from "../../components/ComboCard/ComboCard";
import dataCombo from '../../services/dataCombos'
const Combos = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {dataCombo.map((burger) => (<ComboCard key={burger.id}  burger={burger}/>))}
        </div>
    )
}

export default Combos;