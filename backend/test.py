
# try:
#     import zoneinfo
# except ImportError:
#     from backports import zoneinfo

# from backports.zoneinfo import ZoneInfo
from datetime import datetime, timedelta, timezone
import pytz


# from zoneinfo import ZoneInfo

# UTC = timezone('UTC')
# now = datetime.now(UTC)

# print(now.tzinfo)

# now = datetime.now(tz=tz.tzlocal())
# timezone = pytz.timezone("America/Los_Angeles")
# d_aware = timezone.localize(d)
# print(d_aware.tzinfo)
# # timestamp = dt.replace(tzinfo=timezone.utc).timestamp()
# utc_unaware = datetime.utcnow()
# utc_aware = utc_unaware.replace(tzinfo=ZoneInfo('UTC'))
# local_aware = utc_aware.astimezone(ZoneInfo('localtime'))

# print(utc_aware)
now_utc = pytz.utc.localize(datetime.utcnow())
now_local = now_utc.astimezone(pytz.timezone('America/Los_Angeles'))
print(now_utc)
print(now_local)
