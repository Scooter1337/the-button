import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const PORT = 3003;
const HOST = '127.0.0.1';

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } }) as Server & { on: any };

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(join(__dirname, 'build')));


let groups = new Map<string, Group>();

interface Group {
    name: string;
    users: User[];
    pressed: boolean;
    who_pressed: User | undefined;
    owner: User;
}

interface User {
    name: string;
    id: string;
    display_only: boolean;
}

io.on('connection', (socket: any) => {
    const group_id = socket.handshake.query.room.toLowerCase();
    const name = socket.handshake.query.name;
    const id = socket.handshake.query.id;


    // console.log('a user connected');
    // console.log(name + " wants to join room: " + group_id + " with id: " + id);

    let found_group = groups.get(group_id);

    if (!found_group) {
        let me = { name: name, id: id, display_only: false };
        console.log('group not found, creating new group "' + group_id + '"');
        groups.set(group_id, {
            name: group_id,
            users: [me],
            pressed: false,
            who_pressed: undefined,
            owner: me
        });
        found_group = groups.get(group_id);
    } else {
        // console.log('group found, adding user to group if possible: "' + group_id + '"');

        if (found_group.users.find(user => user.name === name && user.id !== id)) {
            // error, disconnect
            console.log('user with same name already in group, disconnecting');
            socket.disconnect(true);
            return;
        }


        if (found_group.users.find(user => user.id === id)) {
            console.log('user already in group, changing name to: ' + name);
            found_group.users.find(user => user.id === id)!.name = name;
        } else {
            found_group.users.push({ name: name, id: id, display_only: false });
        }
    }

    socket.join(group_id);
    updateGroup(group_id);

    socket.on('disconnect', (reason: any) => {
        // console.log(reason);
        // console.log(name + ' disconnected');
        const group = groups.get(group_id);
        if (!group) {
            console.log('group not found');
            return;
        }

        let leavee_was_owner = group.owner.id === id;


        group.users = group.users.filter(user => user.id !== id);
        if (group.users.length === 0) {
            console.log('group is empty, deleting group');
            groups.delete(group_id);

            socket.in(group_id).disconnectSockets(true);
        } else if (leavee_was_owner) {
            group.owner = group.users[0];
        }
        updateGroup(group_id);

        // check if id still in group
        // if not, disconnect

        if (!group.users.find(user => user.id === id)) {
            console.log('user not found in group, disconnecting');
            socket.disconnect(true);
        }
    });

    socket.on("button_press", (user: User) => {
        const group = groups.get(group_id);
        if (!group) {
            console.error('group not found');
            return;
        }
        if (group.pressed) {
            console.log('button already pressed');
            return;
        }
        group.pressed = true;
        group.who_pressed = user;
        io.to(group_id).emit('button_pressed', user);
    });

    socket.on("reset", () => {
        const group = groups.get(group_id);
        if (!group) {
            console.error('group not found');
            return;
        }
        if (id !== group.owner.id) {
            console.error('only owner can reset');
            return;
        }
        group.pressed = false;
        group.who_pressed = undefined;
        updateGroup(group_id);
    })

    socket.on("set_display_only", (mode: boolean) => {
        const group = groups.get(group_id);
        if (!group) {
            console.error('group not found');
            return;
        }
        const user = group.users.find(user => user.id === id);
        if (!user) {
            console.error('user not found');
            return;
        }

        console.log('setting display only to ' + mode);
        user.display_only = mode;
        updateGroup(group_id);
    })

    socket.on("kick", (user_id: string) => {
        const group = groups.get(group_id);
        if (!group) {
            console.error('group not found');
            return;
        }
        if (id !== group.owner.id) {
            console.error('only owner can kick');
            return;
        }

        group.users = group.users.filter(user => user.id !== user_id);
        updateGroup(group_id);
    });

    socket.on("assign_owner", (user_id: string) => {
        const group = groups.get(group_id);
        if (!group) {
            console.error('group not found');
            return;
        }
        if (id !== group.owner.id) {
            console.error('only owner can assign owner');
            return;
        }

        group.owner = group.users.find(user => user.id === user_id)!;
        updateGroup(group_id);
    });
});

const updateGroup = (group_id: string) => {
    const group = groups.get(group_id);

    if (!group) {
        console.error('group not found');
        return;
    }
    io.to(group_id).emit('group_players', group.users, group.owner, group.pressed, group.who_pressed, group.name);
}

io.engine.on("connection_error", (err) => {
    console.log(err.code);     // 3
    console.log(err.message);  // "Bad request"
    console.log(err.context);  // { name: 'TRANSPORT_MISMATCH', transport: 'websocket', previousTransport: 'polling' }
});





server.listen(PORT, HOST, () => {
    console.log('server running at '+HOST+':'+PORT);
});
