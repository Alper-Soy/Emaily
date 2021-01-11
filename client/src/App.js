import './App.css';

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <a className='App-link' href='/auth/google'>
          Sign In With Google
        </a>
        <a className='App-link' href='/api/current_user'>
          Current User
        </a>
        <a className='App-link' href='/api/logout'>
          Logout
        </a>
      </header>
    </div>
  );
}

export default App;
