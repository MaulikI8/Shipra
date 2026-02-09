from .models import Notification

def create_notification(user, title, message, type='info'):
    """
    Utility function to create a new notification for a user.
    Types can be: 'info', 'success', 'alert', 'error'
    """
    return Notification.objects.create(
        user=user,
        title=title,
        message=message,
        type=type
    )
