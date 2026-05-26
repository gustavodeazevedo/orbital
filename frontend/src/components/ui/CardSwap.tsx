// Cards animados em pilha.
// Usado na secao Features.
/*
 * Ajuda a mostrar varias informacoes em pouco espaco.
 * Cria um efeito visual para destacar as features.
 */
import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  type HTMLAttributes,
  type ReactNode,
  type CSSProperties,
} from "react";
import gsap from "gsap";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, className, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`absolute top-1/2 left-1/2 rounded-xl transform-3d will-change-transform backface-hidden ${customClass ?? ""} ${className ?? ""}`.trim()}
    />
  ),
);
Card.displayName = "Card";

interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (
  i: number,
  distX: number,
  distY: number,
  total: number,
): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });

interface CardSwapProps {
  width?: number;
  height?: number;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (index: number) => void;
  skewAmount?: number;
  easing?: "elastic" | "power";
  children: ReactNode;
}

const CardSwap = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 7000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = "elastic",
  children,
}: CardSwapProps) => {
  const config =
    easing === "elastic"
      ? {
          ease: "elastic.out(0.6,0.9)",
          durDrop: 3,
          durMove: 3,
          durReturn: 3,
          promoteOverlap: 0.9,
          returnDelay: 0.07,
        }
      : {
          ease: "power1.inOut",
          durDrop: 1.5,
          durMove: 1.5,
          durReturn: 1.5,
          promoteOverlap: 0.45,
          returnDelay: 0.2,
        };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length],
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number>(undefined);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const total = refs.length;

    const resetCards = () => {
      refs.forEach((r, i) => {
        if (r.current)
          placeNow(
            r.current,
            makeSlot(i, cardDistance, verticalDistance, total),
            skewAmount,
          );
      });
      order.current = Array.from({ length: refs.length }, (_, i) => i);
    };

    resetCards();

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      if (!elFront) return;

      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: "+=500",
        duration: config.durDrop,
        ease: config.ease,
      });

      tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, "promote");
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease,
          },
          `promote+=${i * 0.15}`,
        );
      });

      const backSlot = makeSlot(
        refs.length - 1,
        cardDistance,
        verticalDistance,
        refs.length,
      );
      tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        "return",
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease,
        },
        "return",
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    const startSwap = () => {
      swap();
      intervalRef.current = window.setInterval(swap, delay);
    };

    const stopSwap = () => {
      tlRef.current?.kill();
      clearInterval(intervalRef.current);
      resetCards();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startSwap();
        } else {
          stopSwap();
        }
      },
      { threshold: 0.4 },
    );

    if (container.current) observer.observe(container.current);

    if (pauseOnHover) {
      const node = container.current;
      if (!node) return () => observer.disconnect();
      const pause = () => {
        tlRef.current?.pause();
        clearInterval(intervalRef.current);
      };
      const resume = () => {
        tlRef.current?.play();
        intervalRef.current = window.setInterval(swap, delay);
      };
      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);
      return () => {
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
        clearInterval(intervalRef.current);
        observer.disconnect();
      };
    }

    return () => {
      clearInterval(intervalRef.current);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing]);

  const rendered = childArr.map((child, i) => {
    if (!isValidElement(child)) return child;
    const childProps = child.props as CardProps & {
      style?: CSSProperties;
      onClick?: (e: React.MouseEvent) => void;
    };
    return cloneElement(child as React.ReactElement<Record<string, unknown>>, {
      key: i,
      ref: refs[i],
      style: { width, height, ...(childProps.style ?? {}) },
      onClick: (e: React.MouseEvent) => {
        childProps.onClick?.(e);
        onCardClick?.(i);
      },
    });
  });

  return (
    <div
      ref={container}
      className="absolute bottom-0 right-0 translate-x-[5%] translate-y-[20%] origin-bottom-right perspective-[900px] overflow-visible max-[768px]:translate-x-[25%] max-[768px]:translate-y-[25%] max-[768px]:scale-75 max-[480px]:translate-x-[25%] max-[480px]:translate-y-[25%] max-[480px]:scale-[0.55]"
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
};

export default CardSwap;
