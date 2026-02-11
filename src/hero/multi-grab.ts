import Matter from "matter-js";

export function setupMultiGrab(
  canvas: HTMLCanvasElement,
  engine: Matter.Engine,
  getBodies: () => Matter.Body[],
  grabRadius = 30,
) {
  const constraints: Matter.Constraint[] = [];
  let grabbing = false;

  function touchPos(e: TouchEvent) {
    const r = canvas.getBoundingClientRect();
    return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
  }

  function startGrab(x: number, y: number): boolean {
    const nearby = Matter.Query.region(getBodies(), {
      min: { x: x - grabRadius, y: y - grabRadius },
      max: { x: x + grabRadius, y: y + grabRadius },
    });
    if (!nearby.length) return false;

    grabbing = true;
    for (const body of nearby) {
      Matter.Sleeping.set(body, false);
      const c = Matter.Constraint.create({
        pointA: { x, y },
        bodyB: body,
        length: 0,
        stiffness: 0.05,
        damping: 0.1,
      });
      constraints.push(c);
      Matter.Composite.add(engine.world, c);
    }
    return true;
  }

  function moveGrab(x: number, y: number) {
    for (const c of constraints) c.pointA = { x, y };
  }

  function endGrab() {
    for (const c of constraints) Matter.Composite.remove(engine.world, c);
    constraints.length = 0;
    grabbing = false;
  }

  canvas.addEventListener("mousedown", e => startGrab(e.offsetX, e.offsetY));
  canvas.addEventListener("mousemove", e => { if (grabbing) moveGrab(e.offsetX, e.offsetY); });
  canvas.addEventListener("mouseup", endGrab);

  canvas.addEventListener("touchstart", e => {
    const p = touchPos(e);
    if (startGrab(p.x, p.y)) e.preventDefault();
  }, { passive: false });

  canvas.addEventListener("touchmove", e => {
    if (!grabbing) return;
    e.preventDefault();
    const p = touchPos(e);
    moveGrab(p.x, p.y);
  }, { passive: false });

  canvas.addEventListener("touchend", endGrab);
}
