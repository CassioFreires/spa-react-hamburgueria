import DrinkCard from "../../components/DrinkCard/DrinkCard";
import dataDrink from '../../services/dataDrinks';

const Drinks = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {dataDrink.map((drink) => (<DrinkCard key={drink.id}  drink={drink}/>))}
        </div>
    )
}

export default Drinks;