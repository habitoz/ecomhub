import { useAdminGetSession } from "medusa-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import LoginCard from "../components/organisms/login-card"
import SignupCard from "../components/organisms/sign-up"
import ResetTokenCard from "../components/organisms/reset-token-card"
import SEO from "../components/seo"
import PublicLayout from "../components/templates/login-layout"

const LoginPage = () => {
  const [resetPassword, setResetPassword] = useState(false)
  const [signUp, setSignUp] = useState(false)

  const { user } = useAdminGetSession()

  const navigate = useNavigate()

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [user, navigate])

  useEffect(() => {
    if (window.location.search.includes("reset-password")) {
      setResetPassword(true)
    }
  }, [])

  const showLogin = () => {
    setResetPassword(false)
    navigate("/login", { replace: true })
  }

  const showResetPassword = () => {
    setResetPassword(true)
  }
  const showSignUp = () => {
    setSignUp(true)
    navigate("/signup", { replace: true })
  }


  return (
    <PublicLayout>
      <SEO title="Abyssinia" />
      {resetPassword ? (
        <ResetTokenCard goBack={showLogin} />
      ) :( signUp ?  (
        <SignupCard toResetPassword={showResetPassword} toLogin = { showLogin} />
      ) : ( <LoginCard toResetPassword={showResetPassword} toSignUp = { showSignUp} /> ))
      }
    </PublicLayout>
  )
}

export default LoginPage
