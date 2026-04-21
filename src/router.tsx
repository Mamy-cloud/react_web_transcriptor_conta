import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Accueil      from './pages/Accueil'
import ViewWork     from './pages/view_work'
import Transcriptor from './pages/transcriptor'
import Login        from './pages/login'
import SignUp       from './pages/sign_up'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<Accueil />} />
        <Route path="/connexion"     element={<Login />} />
        <Route path="/inscription"   element={<SignUp />} />
        <Route path="/travail"       element={<ViewWork />} />
        <Route path="/transcription" element={<Transcriptor />} />
      </Routes>
    </BrowserRouter>
  )
}
