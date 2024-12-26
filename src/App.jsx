import { BrowserRouter as Router  } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import { AuthProvider } from "./contexts/AuthContext"


const App = () => {
  return (
      <Router>
        <AuthProvider>
            <AppRoutes/>
        </AuthProvider>
      </Router>
  )
}

export default App

