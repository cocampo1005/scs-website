<?php

declare(strict_types=1);

namespace Scs\Contact\Tests;

use Scs\Contact\Mail\ContactMessage;
use Scs\Contact\Mail\MailFailure;
use Scs\Contact\Mail\MailTransport;

final class FakeTransport implements MailTransport
{
    /** @var list<ContactMessage> */
    public array $sent = [];

    public ?string $failWith = null;

    public function send(ContactMessage $message): void
    {
        if ($this->failWith !== null) {
            throw new MailFailure($this->failWith);
        }
        $this->sent[] = $message;
    }
}
