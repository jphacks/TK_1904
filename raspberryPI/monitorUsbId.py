import sys
import subprocess
import re
import time
import checkUser
import borrowUmbrella
import recvUserValidation
import returnUmbrella

def get_usbs():
    usb_init = subprocess.check_output('lsusb').decode('utf-8')
    sentence_list = usb_init.split('\n')
    ids_list = []
    for i in range(0, len(sentence_list)-1):
        ids_list.append(sentence_list[i][23:32])
    
    return ids_list

def is_user(id):
    if id[:4]=='0a12':
        return True
    elif id[:4]=='062a':
        return False
    else:
        print("error :usb not recognized")
        return 0

def main():
    usb_init = subprocess.check_output('lsusb').decode('utf-8')
    sentence_list = usb_init.split('\n')
    ids_list = []
    for i in range(0, len(sentence_list)-1):
        ids_list.append(sentence_list[i][23:32])
   

    #0a12で始まればuser_id
    #062aで始まればitem_id

    print(ids_list)
    init_usbs = get_usbs()

    users_in = set()
    users_prev_in = set()
    items_in = set()
    items_prev_in = set()

    current_usbs = get_usbs()
    usbs_in = set()
    #color 0 = no color 
    #color 1 red
    #color 2 green
    color=0
    while True:
        if(color==1):
            prev_id=prev_id
        else:
            prev_id=0
        time.sleep(1)
    
        prev_usbs = current_usbs.copy()
        current_usbs = get_usbs()
        usbs_prev_in = usbs_in.copy()
    
        for id in current_usbs:
            if not (id in prev_usbs):
                usbs_in.add(id)
        for id in prev_usbs:
            if not (id in current_usbs):
                usbs_in.remove(id)
    
        #新しく接続されたusb
        for id in usbs_in:
            if not (id in usbs_prev_in):
                if is_user(id):
                    prev_id=id.
                    #result=recvUserValidation.main()
                    result=subprocess.call([sys.executable,'recvUserValidation.py'])
                    print("result0:"+str(result))
                    #result=checkUser.cmain(id)
                    #result=subprocess.call("python checkUser.py 'id'",shell=True)
                    subprocess.call([sys.execut
                    #result=checkUser.cmain(id)able,'checkUser.py', id])
                
                    print("result1:"+str(result))
                    if(result==True):
                        print("user exists")
                        color=1
                    else:
                        print("user isnt there")
                        color=0
                    
                else:
                    returnUmbrella.main(id)
                    
    #抜かれたusb
        for id in usbs_prev_in:
            if not (id in usbs_in):
                if is_user(id):
                    pass
                else:
                    borrowUmbrella.main(prev_id, id)

        print(prev_usbs)
        print(current_usbs)
        print(usbs_in)
        print(usbs_prev_in)

if __name__ == "__main__":
    main()
