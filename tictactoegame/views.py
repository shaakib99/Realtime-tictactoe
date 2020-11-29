from django.shortcuts import render,redirect

def index(req,boardId = None):
    templatePath = 'tictactoegame/index.html'
    return render(req,templatePath,{'boardId': boardId})

