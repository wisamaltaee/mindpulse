from fastapi.testclient import TestClient
from main import app
import time

client = TestClient(app)

print('Posting /start (0.02 minutes)')
r = client.post('/start', json={'minutes': 0.02})
print('POST response:', r.status_code, r.json())

timer_id = r.json().get('id')
if timer_id:
    time.sleep(1)
    r2 = client.get(f'/status/{timer_id}')
    print('STATUS response:', r2.status_code, r2.json())
else:
    print('No timer id returned')
