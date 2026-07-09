#!/bin/bash
cd /home/z/my-project
pkill -9 -f "next dev" 2>/dev/null
sleep 2
nohup ./node_modules/.bin/next dev -p 3000 > /home/z/my-project/dev.log 2>&1 &
DEV_PID=$!
echo "Dev server PID: $DEV_PID"
# Wait for it to be ready
for i in $(seq 1 30); do
  if curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/" 2>/dev/null | grep -q "200"; then
    echo "Server ready!"
    break
  fi
  sleep 1
done
echo "Final status:"
curl -s -o /dev/null -w "HTTP %{http_code}\n" "http://localhost:3000/" 2>/dev/null
