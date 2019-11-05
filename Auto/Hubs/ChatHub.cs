using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Auto.ModelsApp;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;
using DomainCore.Interfaces;
namespace Auto.Hubs
{
    
    public class ChatHub : Hub
    {
        static List<User> Users = new List<User>();

        // Отправка сообщений
        public void Send(string name, int SpeachId, string message)
        {

            List<User> users = Users.Where(x => x.IdSpeach == SpeachId).ToList();
            foreach (var user in users)
            {
                Clients.Client(user.ConnectionId).addMessage(name, message);
            }
        }

        // Подключение нового пользователя
        public void Connect(string userName, int SpeachId)
        {
            var id = Context.ConnectionId;


            if (!Users.Any(x => x.ConnectionId == id))
            {
                Users.Add(new User { ConnectionId = id, Name = userName, IdSpeach = SpeachId });

                // Посылаем сообщение текущему пользователю
                Clients.Caller.onConnected(id, userName);
            }
        }

        // Отключение пользователя
        public override Task OnDisconnected(bool stopCalled)
        {
            var item = Users.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (item != null)
            {
                Users.Remove(item);
            }

            return base.OnDisconnected(stopCalled);
        }
    }
}