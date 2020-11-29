from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json

class GameConsumer(WebsocketConsumer):
    def connect(self):
        maxConnection = 1 # host + 1 connection
        boardID = str(self.scope['url_route']['kwargs']['boardId'])
        try:
            numberOfClient = len(self.channel_layer.groups[boardID])
        except:
            numberOfClient = -1

        if numberOfClient <= maxConnection:
            async_to_sync(self.channel_layer.group_add)(
                boardID,
                self.channel_name
            )
            self.accept()
            if numberOfClient == 1:
                x = json.dumps({
                    'boardId': boardID,
                    'status': 'initiate' 
                })
                self.receive(x)

    def disconnect(self,code,boardId = None):
        for key in self.channel_layer.groups:
            boardId = key
            async_to_sync(self.channel_layer.group_discard)(
                boardId,
                self.channel_name,
            )
            async_to_sync(self.channel_layer.group_send)(
                boardId,
                {
                    'type': 'send_msg',
                    'data': json.dumps({
                        'status': 'close',
                        'win': None,
                    })
                }
            )

    def receive(self,text_data):
        data = self.createReturnData(text_data)
        boardId = json.loads(data)['boardId']
        status = json.loads(data)['status']
        async_to_sync(self.channel_layer.group_send)(
                    boardId,
                    {
                        'type': 'send.msg',
                        'data': data
                    })

        if status == 'close' or status == 'draw':
            groups = self.channel_layer.groups[boardId]
            for eid in groups:
                async_to_sync(self.channel_layer.group_discard)(
                    boardId,
                    eid
                )

    def send_msg(self,e):
        self.send(e['data'])
    

    def createReturnData(self, x):
        x = json.loads(x)
        try:
            matrix = x['matrix']
        except:
            matrix = [[-1]*3,[-1]*3,[-1]*3]
        try:
            status = x['status']
        except:
            status = 'close'
        try:
            playerturn = 0 if x['playerturn'] == 1 else 1
        except:
            from random import seed
            from random import randint
            seed(1)
            playerturn =  randint(0,1)
        try:
            win = x['win']
        except:
            win = None
        try:
            symbols = x['symbols']
        except:
            symbol = ['X','O']
            from random import seed
            from random import randint
            seed(1)
            randomNumber  = randint(0,1)
            player1Symbol =  symbol[0] if randomNumber == 0 else symbol[1]
            player2Symbol = symbol[1] if randomNumber == 0 else symbol[0]
            symbols = [player1Symbol,player2Symbol]
        try:
            changeCoord = x['changedCoord']
        except:
            changeCoord = None
        try:
            changedBy = x['changedBy']
        except:
            changedBy = None
        try:
            boardId = x['boardId']
        except:
            raise
        
        finalData = json.dumps({
            'boardId': boardId,
            'matrix': matrix,
            'status': status,
            'playerturn': playerturn,
            'win': win,
            'symbols': symbols,
            'changedCoord': changeCoord,
            'changedBy': changedBy
        })
        return finalData