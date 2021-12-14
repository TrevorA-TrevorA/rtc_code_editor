

# Code Room

A real-time collaborative code-editing interface.

**Summary**: Description: Authenticated users invite one or more people to co-edit source files. During an edit session, editors stream changes to the code through WebRTC data channels, which are initialized by a websocket server. Separate websocket channels are used for chat and notifications. The editor component has VS Code key bindings.

I also intend to develop a CLI with watch mode and git integration.

**Backend**: Ruby on Rails with PostgreSQL

**UI**: React, Redux, and the Ace Editor API.

**Status**: Currently in development.

https://user-images.githubusercontent.com/53229267/141910875-c4371f4d-3b27-416c-ad15-12db624f9d5e.mov

