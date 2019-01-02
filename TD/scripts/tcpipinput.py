import scripts
import json

def onReceive(dat, rowIndex, message, bytes, peer):
    scripts.apply(json.loads(message))
    return
