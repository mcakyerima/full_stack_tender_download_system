"use client";
import FilesBrowser from "../../../components/file-browser";

export default function FavoritesPage(){
    return (
        <div>
            <FilesBrowser title="Your Favorites" favorites={true}/>
        </div>
    )
}
