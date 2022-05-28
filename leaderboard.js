fetch('https://escape12c10.herokuapp.com/ranks?num=10', {
  method: 'GET'
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
})
.catch((error) => {
  console.error('Error:', error);
});