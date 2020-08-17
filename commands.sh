mkdir from-empty-react-redux
cd from-empty-react-redux/
dotnet new sln
dotnet new web --name api-web-server
dotnet new classlib --name database
dotnet sln add api-web-server/
dotnet sln add database
dotnet add api-web-server/api-web-server.csproj reference database/database.csproj
cd api-web-server/

# ---------- IN /api-web-server: -------------

npx create-react-app client-app --typescript
cd client-app/

# ---------- IN /client-app: -------------

npm install --save \
    redux @types/redux \
    react-redux @types/react-redux \
    reactstrap @types/reactstrap
npm install
npm audit fix
cd ..

# ---------- IN /api-web-server: -------------

dotnet add package Microsoft.AspNetCore.SpaServices.Extensions
cd ..

# ---------- IN /from-empty-react-redux: -------------

git init
git status
echo "" > .gitignore
