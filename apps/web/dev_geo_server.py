#!/usr/bin/env python3
import json
import os
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse

PUBLIC_DIR = os.path.join(os.path.dirname(__file__), 'public')
LOG_DIR = os.path.join(os.path.dirname(__file__), 'logs')
LOG_PATH = os.path.join(LOG_DIR, 'geo.log')

os.makedirs(LOG_DIR, exist_ok=True)

class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # Serve files from PUBLIC_DIR for GET
        relpath = urlparse(path).path
        if relpath.startswith('/api/'):
            # not a file
            return SimpleHTTPRequestHandler.translate_path(self, '/')
        # map to public dir
        full = os.path.join(PUBLIC_DIR, relpath.lstrip('/'))
        return full

    def do_POST(self):
        if self.path != '/api/geo-log':
            self.send_response(404)
            self.end_headers()
            return
        length = int(self.headers.get('Content-Length', 0))
        try:
            raw = self.rfile.read(length) if length else b''
            text = raw.decode('utf-8') if raw else ''
            data = json.loads(text) if text else {}
        except Exception as e:
            self.send_response(400)
            self.end_headers()
            return
        # enrich with remote addr and user-agent header if present
        data['_remote_addr'] = self.client_address[0]
        data['_ua_header'] = self.headers.get('User-Agent')
        data['_ts_server'] = int(__import__('time').time()*1000)
        line = json.dumps(data, ensure_ascii=False)
        with open(LOG_PATH, 'a', encoding='utf-8') as f:
            f.write(line + '\n')
        print('[geo-log] stored:', line)
        self.send_response(204)
        self.end_headers()

if __name__ == '__main__':
    os.chdir(PUBLIC_DIR)
    port = 8000
    server = ThreadingHTTPServer(('0.0.0.0', port), Handler)
    print('Serving at http://0.0.0.0:%d (public: %s, logs: %s)' % (port, PUBLIC_DIR, LOG_PATH))
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.shutdown()
        print('Server stopped')
