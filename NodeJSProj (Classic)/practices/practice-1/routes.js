
const routes = (req, res) => {
    const url = req.url;
  const method = req.method;

  if (url === "/users") {
    res.write(
      "<html>  <body>  <ul><li>User 1</li> <li>User 2</li></ul> </body>  </html>"
    );
    return res.end()
  }

  if(url === "/create-user" && method === 'POST'){
    const data = [];
    req.on('data', (chunk) => {
        data.push(chunk)
    })
    req.on('end', () => {
        const textData = Buffer.concat(data).toString();
        const text = textData.split('=')[1];
        console.log(text)
    })
  }

  res.write('<html><body><form action="/create-user" method="POST"> <input name="dummy"  type="text"  /> <button type="submit">Send</button></form> </body></html>')
  res.end()
}

module.exports = routes;