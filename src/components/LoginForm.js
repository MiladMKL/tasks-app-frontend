// LoginForm ist eigentlich nur ein Template, das die Login-Formular-Elemente enthält.
// Der aufrufer muss die Elemente die das LoginForm braucht an ihr übergeben.
const LoginForm = ({ handleSubmit, handleUsernameChange, handlePasswordChange, username, password }) => {
  return (
    <div className="my-login-form">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          username:
          <input type="text" value={username} onChange={handleUsernameChange} /> {/* handleUsernameChange setzt in App nur useState var */}
        </div>
        <div>
          password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm