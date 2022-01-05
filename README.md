

# RTC Code Editor

A real-time collaborative code-editing interface.

**Summary**: Authenticated users invite one or more people to co-edit source files. During an edit session, editors stream changes to the code through WebRTC data channels, which are initialized by a websocket server. Separate websocket channels are used for chat and notifications. The editor component has VS Code key bindings.

**Backend**: Ruby on Rails with PostgreSQL

**UI**: React, Redux, and the Ace Editor API.

**Status**: Currently in development.

https://user-images.githubusercontent.com/53229267/148244461-336c218c-4a8c-4ea3-a942-2f54626fe0fb.mov

