const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

let num = params.top || 10;

function insertTable(i, data) {
  /*
  <td>2</td>
  <td>namrc</td>
  <td>200</td>
  <td>28/5/2022</td>
  */
  let str = `
  <td>${i+1}</td>
  <td><a href="user.html?username=${data.name}">${data.name}<a></td>
  <td>${data.time}</td>
  <td>${data.date}</td>
  `;
  let node = document.createElement("tr");
  // const textnode = document.createTextNode(str);
  node.innerHTML = str;
  document.getElementById("rank").appendChild(node);
}

fetch(`https://escape12c10.herokuapp.com/ranks?top=${num}`, {
  method: 'GET'
})
  .then(response => response.json())
  .then(data => {
    data.forEach(function (value, i) {
      insertTable(i, value)
    })
  })
  .catch((error) => {
    console.error('Error:', error);
  });