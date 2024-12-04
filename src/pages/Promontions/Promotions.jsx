import dataPromotion from '../../services/dataPromotions'
import PromotionCard from "../../components/PromotionCard/PromotionCard";

const Promotion = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {dataPromotion.map((burger) => (<PromotionCard key={burger.id}  burger={burger}/>))}
        </div>
    )
}

export default Promotion;