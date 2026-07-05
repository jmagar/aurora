import { Login } from "@/registry/aurora/blocks/auth/login/login"

export default function AuroraLoginPage() {
  return (
    <main className="aurora-page-shell grid min-h-screen place-items-center p-6">
      <Login />
    </main>
  )
}
