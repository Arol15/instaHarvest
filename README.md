# InstaHarvest

![](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/Arol15/instaHarvest/master/package.json?&label=node&query=$.engines.node&color=orange) ![](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/Arol15/instaHarvest/master/package.json?&label=react&query=$.dependencies.react&color=red) ![](https://img.shields.io/badge/Flask-1.1.2-blue) ![GitHub](https://img.shields.io/github/license/Arol15/instaHarvest)

🟡In progress...

Find and share local homegrown fruits and vegetables

### Demo

[InstaHarvest](http://www.instaharvest.net/)

---

## Technologies

**Database:**

- PostgreSQL
- Managing database with [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/en/2.x/)

**Back-end:**

- [Flask](https://flask.palletsprojects.com/en/1.1.x/)
- Establishing connection between users in chats with [python-socketio](https://github.com/miguelgrinberg/python-socketio)
- Sending automatic emails to users with [Flask-Mail](https://pythonhosted.org/Flask-Mail/)
- Secure user authentication and authorization using server-side [sessions](https://flask-session.readthedocs.io/en/latest/)

**Front-end:**

- [React](https://reactjs.org/) using functional components and hooks
- Managing complex app state with [Redux](https://redux.js.org/)
- Establishing connection between users in chats with [socket.io](https://socket.io/docs/v4)

**Mapping and locations:**

- [Mapbox](https://www.mapbox.com/)

**Testing:**

- [Pytest](https://flask.palletsprojects.com/en/1.1.x/testing/)
