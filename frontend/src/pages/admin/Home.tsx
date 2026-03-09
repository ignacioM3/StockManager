import { PageContainer } from '../../component/styles/PageContainer'
import { PageContent } from '../../component/styles/PageContent'
import { PageHeader } from '../../component/styles/PageHeader'
import { PageTitle } from '../../component/styles/PageTitle'
import useAuth from '../../hooks/use-auth'

export function Home() {
  const {currentUser} = useAuth()
  console.log(currentUser)
  return (
     <PageContainer>
      <PageHeader>
        <PageTitle className="text-center">Bienvenido al Menu Admin</PageTitle>
      </PageHeader>
      <PageContent>
        <div className="text-center my-4">
          <p className="md:text-xl">Aca Podras administrar <span className="text-gray-500 font-bold">Usuarios</span>, <span className="text-gray-500 font-bold">ganancias</span> y <span className="text-gray-500 font-bold">Stock</span></p>
        </div>


      </PageContent>
    </PageContainer>
  )
}
