# todo:

- get .env working
- figure out how to create admin commands
- refactor command syntax
  - /poker waitlist add
    - don't allow people to add themselves multiple times
    - store id to handle duplicate nicknames?
  - /poker waitlist view
    - view current wait list order
    - make it display as:
      1. vdm
      2. champ
      3. blah
  - /poker waitlist next (admin)
    - should @ the player
    - should state they have 5m
    - should remove them from the list
  - /poker waitlist add player index (admin)
    - should add the player at the index (for fixing mistakes)
