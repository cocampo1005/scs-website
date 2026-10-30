<?php

declare(strict_types=1);

namespace Scs\Contact\Mail;

use RuntimeException;

/** A send failed. The message is a short reason code that is safe to log. */
final class MailFailure extends RuntimeException
{
}
