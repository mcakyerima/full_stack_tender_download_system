import { UnderDesign } from "@/components/awating-page"
import FilesBrowser from "../_components/file-browser";

const FavoritesPage = () => {
    return (
        <div>
            <FilesBrowser title="Your Favorites" favorites={true}/>
        </div>
    )
}

export default FavoritesPage;