from django.shortcuts import render

def index(req,boardId = None):
    templatePath = 'tictactoegame/index.html'
    return render(req,templatePath,{'boardId': boardId})
