from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'index.html')

def bts_shoots(request):
    return render(request, 'bts.html')

def about(request):
    return render(request, 'about.html')