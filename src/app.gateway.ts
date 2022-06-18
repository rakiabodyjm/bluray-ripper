import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { SocketConnectOpts } from 'net';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  socketInstance: Server;
  typingClient;
  mema = 0;
  clients: { id: string; name: string }[];
  handleDisconnect(client: any) {
    // throw new Error('Method not implemented.');
    console.log('disconnected');
  }
  handleConnection(socket: Socket, ...args: any[]) {
    console.log('Client connected', ++this.mema, socket.handshake.headers.name);
  }

  afterInit(server: Server) {
    this.socketInstance = server;
    // console.log(Object.keys(this.socketInstance.engine));
    console.log(this.socketInstance.engine);
    // console.log(this.socketInstance.)
    // console.log('App gaateway initiated');
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    this.socketInstance.emit('message', {
      sender: client.handshake.headers.name,
      message: payload,
      timestamp: Date.now(),
    });
  }

  @SubscribeMessage('typing')
  handleTyping(socket: Socket, payload: any) {
    this.socketInstance.emit('typing', socket.handshake.headers.name);
  }
}
