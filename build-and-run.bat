set pwd=%cd%

if not exist %pwd%\FAE04EC0-301F-11D3-BF4B-00C04F79EFBC.check (
    echo "Run script from project directory: 'from-empty-react-redux'"
    exit 1
)

echo "Installing npm packages..."
cd api-web-server/client-app/
npm install
cd ../..

echo "Running server..."
dotnet run --project api-web-server/api-web-server.csproj