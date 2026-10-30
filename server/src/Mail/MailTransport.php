<?php

declare(strict_types=1);

namespace Scs\Contact\Mail;

interface MailTransport
{
    /** @throws MailFailure */
    public function send(ContactMessage $message): void;
}
