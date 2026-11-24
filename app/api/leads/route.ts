type LeadRequest = {
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  address?: unknown;
  packageId?: unknown;
};

const requiredFields: Array<keyof LeadRequest> = ["fullName", "email", "phone", "address", "packageId"];

export async function POST(request: Request) {
  let body: LeadRequest;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "The request body must be valid JSON." }, { status: 400 });
  }

  const hasMissingField = requiredFields.some((field) => {
    const value = body[field];
    return typeof value !== "string" || value.trim() === "";
  });

  if (hasMissingField) {
    return Response.json({ error: "Please complete every required field." }, { status: 400 });
  }

  const email = body.email as string;
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  return Response.json(
    {
      leadId: `lead_${crypto.randomUUID().slice(0, 8)}`,
      eventId: `lead_event_${crypto.randomUUID()}`,
      submittedAt: new Date().toISOString(),
      status: "accepted",
    },
    { status: 201 },
  );
}
