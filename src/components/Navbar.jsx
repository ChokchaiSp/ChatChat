import { useAuth } from "../contexts/AuthContext";
import { LogOut } from "lucide-react";

const Navbar = () => {

    const { user, signOut } = useAuth();

    return (
        <nav className="bg-sky-500/50 shadow-lg border-b">
            <div className="max-w-7x1 mx-auto px-4">
                <div className="flex justify-between">
                    <div className="flex-shrink-0 flex items-center">
                        <h1 className="text-xl font-bold"> <strong>Chat Chat </strong></h1>
                    </div>

                    {user && (
                        <div className="flex items-center">
                            <span className="mr-4"> {user.email} </span>
                            <button
                                onClick={signOut}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                            </button>
                        </div>
                    )}

                </div>

            </div>

        </nav>
    )
}

export default Navbar;
