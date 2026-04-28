import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Accueil          from './pages/Accueil'
import ViewWork         from './pages/view_work'
import Transcriptor     from './pages/transcriptor'
import Login            from './pages/login'
import SignUp           from './pages/sign_up'
import Admin            from './pages/admin'
import Page404          from './pages/page404'
import PageInexistante  from './pages/page_inexistante'
import ForgotPassword   from './pages/forgot_password'
import ResetPassword    from './pages/reset_password'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                               element={<Accueil />} />
        <Route path="/connexion"                      element={<Login />} />
        <Route path="/inscription"                    element={<SignUp />} />
        <Route path="/travail"                        element={<ViewWork />} />
        <Route path="/transcription"                  element={<Transcriptor />} />
        <Route path="/admin"                          element={<Admin />} />
        <Route path="/error_404"                      element={<Page404 />} />
        <Route path="/mot-de-passe-oublie"            element={<ForgotPassword />} />
        <Route path="/reinitialiser-mot-de-passe"     element={<ResetPassword />} />
        <Route path="*"                               element={<PageInexistante />} />
      </Routes>
    </BrowserRouter>
  )
}
