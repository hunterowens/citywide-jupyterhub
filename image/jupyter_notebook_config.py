c.ServerProxy.servers = {
    'pgadmin': {
        'command': [
            'gunicorn',
            '-b',
            '127.0.0.1:{port}',
            '-e',
            'SCRIPT_NAME={base_url}pgadmin/',
            '--chdir',
            '/opt/conda/lib/python3.7/site-packages/pgadmin4/',
            'pgadmin4.pgAdmin4:app',
        ],
        'absolute_url': True,
        'timeout': 10,
    }
}
