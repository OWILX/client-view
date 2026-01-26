from livereload import Server

server = Server()

# Watch all HTML, CSS, and JS files
server.watch('*.html')
server.watch('assets/css/*.css')
server.watch('assets/js/*.js')

# Serve the current directory on port 8000
server.serve(port=8000, host='localhost')
