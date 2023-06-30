import * as TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import { ICloudPosition, IPCD, IShaderMode } from "../types.js";
import { genHslColorMap, hex2rgb } from "./color.js";
import { DOUBLEPI, moduloHalfPI } from "./math.js";
import { OrbitControls } from "./orbitControls.js";

export default class Cloud {
  // 场景
  scene!: THREE.Scene;
  // 渲染器
  renderer!: THREE.WebGLRenderer;
  // 透视相机或投影相机
  camera!: THREE.Camera;
  // 轨道控制器
  controls!: OrbitControls;
  // 光线投射
  raycaster = new THREE.Raycaster();
  // 视锥体
  frustum = new THREE.Frustum();
  // 球体
  sphere = new THREE.Sphere();
  // 点云对象
  cloudObject!: THREE.Points;
  // 点云数据
  cloudData: ICloudPosition[] = [];
  // 高亮点的索引
  highlightedIndex = -1;
  // 相交的对象
  intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[] = [];
  // 鼠标二维坐标
  pointer = new THREE.Vector2();
  // 屏幕投影坐标
  projection = new Map<ICloudPosition, { pixelX: number; pixelY: number }>();
  // 视锥体点索引
  frustumIndices = new Set<number>();
  // 可见点索引
  visibleIndices = new Set<number>();
  // 隐藏点索引
  hiddenIndices = new Set<number>();
  // 选中点索引
  selectedIndices = [];
  // 画布
  canvas!: HTMLCanvasElement;
  // 画布宽度
  width = 0;
  // 画布高度
  height = 0;
  // 画布容器
  container!: HTMLElement;
  // 着色模式
  shaderMode: IShaderMode = "gray";
  // 相机模式
  cameraMode: "perspective" | "orthographic" = "perspective";
  // 是否旋转中
  orbiting = false;
  // 点云点大小
  pointSize = 2;
  // 相机位置
  cameraPosition: "front" | "side" | "top" = "front";
  // 相机坡度
  cameraSlope = 0;
  // 相机预设角度对应目标
  cameraPresetTarget: "selected" | "visible" = "visible";
  // 视角切换动画
  tween = false;
  // 时长
  tweenDuration = 500;
  // 状态
  cameraState = {
    moving: false,
    position: 0,
    originalTarget: new THREE.Vector3(),
    fromTheta: 0,
    toTheta: 0,
    rangeTheta: 0,
    fromPhi: 0,
    toPhi: 0,
    rangePhi: 0,
    fromRadius: 0,
    toRadius: 0,
    rangeRadius: 0,
    fromX: 0,
    toX: 0,
    fromY: 0,
    toY: 0,
    fromZ: 0,
    toZ: 0,
    rangeX: 0,
    rangeY: 0,
    rangeZ: 0,
  };

  endCameraTween = () => {
    this.cameraState.moving = false;
  };

  cameraTween = new TWEEN.Tween(this.cameraState)
    .onStop(this.endCameraTween)
    .onComplete(this.endCameraTween);

  hslColorMap = genHslColorMap();

  pcd?: IPCD;

  // get targetIndices() {
  //   return this.cameraPresetTarget === "visible"
  //     ? this.visibleIndices
  //     : this.selectedIndices.length
  //     ? this.selectedIndices
  //     : this.visibleIndices;
  // }

  init(options: {
    canvas: HTMLCanvasElement;
    container: HTMLElement;
    width: number;
    height: number;
    shaderMode?: IShaderMode;
  }) {
    if (options.shaderMode) {
      this.shaderMode = options.shaderMode;
    }
    // this.cameraMode = options.cameraMode;
    const canvasWidth = (this.width = options.width);
    const canvasHeight = (this.height = options.height);
    // scene
    const scene = (this.scene = new THREE.Scene());
    scene.background = new THREE.Color(0x111111);

    // webgl renderer
    const canvas = (this.canvas = options.canvas);
    const renderer = (this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
      powerPreference: "high-performance",
    }));
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvasWidth, canvasHeight);

    // light
    let light = new THREE.PointLight(0xffffff, 1, 1000);
    light.position.set(0, -50, 50);
    scene.add(light);
    light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(50, -50, 0);
    scene.add(light);
    light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(50, -50, 50);
    scene.add(light);
    light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(-50, -50, 50);
    scene.add(light);

    // controls
    const container = (this.container = options.container);

    this.initCamera();

    container.addEventListener("mousemove", this.onMouseMove);

    // axes helper
    this.scene.add(new THREE.AxesHelper(2));

    this.render();
    window.requestAnimationFrame(this.animate);
  }

  initCamera() {
    const canvasWidth = this.width;
    const canvasHeight = this.height;

    this.scene.remove(this.camera);
    // camera
    const camera = (this.camera =
      this.cameraMode === "perspective"
        ? new THREE.PerspectiveCamera(
            75,
            canvasWidth / canvasHeight,
            0.01,
            20000
          )
        : new THREE.OrthographicCamera(
            canvasWidth / -2,
            canvasWidth / 2,
            canvasHeight / 2,
            canvasHeight / -2
          ));

    camera.updateProjectionMatrix();
    // z up
    camera.up.set(0, 0, 1);
    this.scene.add(camera);

    const controls = (this.controls = new OrbitControls(
      camera,
      this.container
    ));
    controls.zoomToCursor = true;

    controls.addEventListener("change", () => {
      this.render();
    });
  }

  animate = (time: number) => {
    this.updateCamera(time);
    this.updateRaycaster();
    // this.updateProjection();
    requestAnimationFrame((time) => this.animate(time));
  };

  render = () => {
    this.renderer.render(this.scene, this.camera);
  };

  renderPCDFile(pcd: IPCD) {
    this.scene.remove(this.cloudObject);
    const { position, label, intensity, object } = (this.pcd = pcd);

    this.cloudData = [];
    const geometry = new THREE.BufferGeometry();
    let pos: ICloudPosition;

    position.forEach((v, i) => {
      switch (i % 3) {
        case 0:
          pos = { x: v, y: 0, z: 0, labelIndex: -1 };
          break;
        case 1:
          pos.y = v;
          break;
        case 2:
          pos.z = v;
          if (isNaN(pos.x) || isNaN(pos.y) || isNaN(pos.z)) {
            pos = {
              ...pos,
              x: 0,
              y: 0,
              z: 0,
            };
          }
          this.cloudData.push(pos);
          break;
      }
    });

    this.visibleIndices = new Set([...Array(this.cloudData.length).keys()]);

    const colors: number[] = [];
    if (label) {
      label.forEach((v, i) => {
        if (this.cloudData[i]) {
          this.cloudData[i].labelIndex = v;
          const rgb = hex2rgb(this.getPointColor(i));
          colors.push(rgb[0], rgb[1], rgb[2]);
        }
      });
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(position, 3)
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    // geometry.computeBoundingSphere();
    // geometry.computeBoundingBox();

    const material = new THREE.PointsMaterial({
      size: this.pointSize,
      vertexColors: true,
    });
    material.sizeAttenuation = false;

    // build mesh
    const cloudObject = (this.cloudObject = new THREE.Points(
      geometry,
      material
    ));

    this.scene.add(cloudObject);

    this.updateSphere();

    this.render();
  }

  cameraPreset(
    position: "front" | "top" | "side" = "front",
    slope = 0,
    target: "selected" | "visible" = "visible",
    tween = false
  ) {
    this.cameraPosition = position;
    this.cameraSlope = slope;
    this.cameraPresetTarget = target;
    this.tween = tween;
  }

  getCenter(indices: number[]) {
    const geometry = new THREE.BufferGeometry();
    const points: THREE.Vector3[] = [];
    indices.forEach((idx) => {
      const item = this.cloudData[idx];
      points.push(new THREE.Vector3(item.x, item.y, item.z));
    });
    geometry.setFromPoints(points);
    return new THREE.Box3()
      .setFromObject(new THREE.Mesh(geometry))
      .getCenter(new THREE.Vector3());
  }

  getProjection(indices: number[]) {
    const points = indices.map((idx) => {
      const item = this.cloudData[idx];
      return new THREE.Vector3(item.x, item.y, item.z);
    });

    points.forEach((p) => {
      return p.project(this.camera);
    });

    return points;
  }

  getPointColor(idx: number) {
    switch (this.shaderMode) {
      case "height":
      case "gray":
        return "#CFCFCF";
      case "intensity":
        return this.hslColorMap[this.pcd!.intensity[idx]];
      default:
        return "#CFCFCF";
    }
  }

  fitView(eye3: THREE.Vector3, tar3: THREE.Vector3) {
    const eyeVec3 = eye3;
    const targetVec3 = tar3;
    const line = new THREE.Line3(targetVec3, eyeVec3);
    const radius = this.sphere.radius || 10;
    let distance = 0;

    if (this.camera instanceof THREE.PerspectiveCamera) {
      const fov = this.camera.fov;
      const angle = (fov * Math.PI) / 360;
      const distanceToCenter = radius / Math.tan(angle);
      distance = 1.5 * distanceToCenter;
    } else if (this.camera instanceof THREE.OrthographicCamera) {
      distance = radius;
    }

    const delta = distance / line.distance();
    const newEyeVec3 = line.at(delta, new THREE.Vector3());
    this._moveCamera(newEyeVec3, targetVec3);
  }

  moveCamera(arg0: THREE.Vector3, arg1: THREE.Vector3) {
    let eye: THREE.Vector3;
    let target: THREE.Vector3;

    eye = arg0;
    target = arg1;
    const center = this.getCenter([...this.visibleIndices]);
    const z = center.z + this.cameraSlope;
    if (!eye) {
      switch (this.cameraPosition) {
        case "front":
          eye = new THREE.Vector3(center.x, center.y - 1, z);
          break;
        case "side":
          eye = new THREE.Vector3(center.x - 1, center.y, center.z);
          break;
        case "top":
          eye = new THREE.Vector3(center.x, center.y * 0.99999, -1);
          break;
      }
    }
    if (!target) {
      target = center;
    }

    this.fitView(eye, target);
  }

  private _moveCamera(eye: THREE.Vector3, target: THREE.Vector3) {
    this.orbiting = true;
    const orientedRange = (a0: number, a1: number) => {
      const da = (a1 - a0) % DOUBLEPI;
      return moduloHalfPI(((2 * da) % DOUBLEPI) - da);
    };

    this.cameraState.moving = true;

    const target0 = this.controls.target;
    const target1 = target || this.controls.target;

    const eye0FromTarget = new THREE.Spherical()
      .setFromVector3(this.camera.position.sub(target1))
      .makeSafe();
    const eye1FromTarget = eye
      ? new THREE.Spherical().setFromVector3(eye.sub(target1)).makeSafe()
      : eye0FromTarget;

    const state = this.cameraState;
    state.originalTarget.copy(target1);
    state.position = this.tween ? 0 : 1;
    state.fromPhi = moduloHalfPI(eye0FromTarget.phi);
    state.fromTheta = moduloHalfPI(eye0FromTarget.theta);
    state.fromRadius = eye0FromTarget.radius;
    state.toPhi = moduloHalfPI(eye1FromTarget.phi);
    state.toTheta = moduloHalfPI(eye1FromTarget.theta);
    state.toRadius = eye1FromTarget.radius;
    state.rangePhi = orientedRange(eye0FromTarget.phi, eye1FromTarget.phi);
    state.rangeTheta = orientedRange(
      eye0FromTarget.theta,
      eye1FromTarget.theta
    );
    state.rangeRadius = this.cameraState.toRadius - this.cameraState.fromRadius;
    state.fromX = target0.x;
    state.fromY = target0.y;
    state.fromZ = target0.z;
    state.toX = target1.x;
    state.toY = target1.y;
    state.toZ = target1.z;
    state.rangeX = target1.x - target0.x;
    state.rangeY = target1.y - target0.y;
    state.rangeZ = target1.z - target0.z;

    this.cameraTween
      .to({ position: 1 }, this.tweenDuration)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();
  }

  highlightIndex(index: number) {
    this.highlightedIndex = index;
  }

  updateCamera(time: number) {
    if (this.cameraState.moving) {
      this.cameraTween.update(time);
      const state = this.cameraState;
      const pos = state.position;

      // Changing target
      const x = state.fromX + state.rangeX * pos;
      const y = state.fromY + state.rangeY * pos;
      const z = state.fromZ + state.rangeZ * pos;
      this.controls.target.copy(new THREE.Vector3(x, y, z));

      // Changing camera position
      const phi = state.fromPhi + state.rangePhi * pos;
      const theta = state.fromTheta + state.rangeTheta * pos;
      const radius = state.fromRadius + state.rangeRadius * pos;
      const sphericalPosition = new THREE.Spherical(
        radius,
        phi,
        theta
      ).makeSafe();
      const newCamPosition = new THREE.Vector3().setFromSpherical(
        sphericalPosition
      );

      this.camera.position.copy(
        newCamPosition.add(this.cameraState.originalTarget)
      );
      this.camera.updateMatrix();
      if (this.camera instanceof THREE.OrthographicCamera) {
        this.camera.updateProjectionMatrix();
      }
      this.controls.update();
      this.render();
    }
  }

  updateSphere() {
    const points: THREE.Vector3[] = [];
    this.visibleIndices.forEach((idx) => {
      const item = this.cloudData[idx];
      points.push(new THREE.Vector3(item.x, item.y, item.z));
    });
    this.sphere.setFromPoints(points);
  }

  updateRaycaster() {
    if (this.raycaster) {
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const intersects = (this.intersects = this.raycaster
        .intersectObjects(this.scene.children, true)
        .sort((a, b) => (a.distanceToRay! < b.distanceToRay! ? -1 : 1)));

      if (intersects.length && intersects[0].index != null) {
        this.highlightIndex(intersects[0].index);
      } else {
        this.highlightIndex(-1);
      }
    }
  }

  updateProjection() {
    if (!this.cloudData) return;

    this.frustum.setFromProjectionMatrix(
      new THREE.Matrix4().multiplyMatrices(
        this.camera.projectionMatrix,
        this.camera.matrixWorldInverse
      )
    );

    const vector = new THREE.Vector3();
    const halfW = this.width / 2;
    const halfH = this.height / 2;

    const toScreen = (item: ICloudPosition, idx: number) => {
      vector.set(item.x, item.y, item.z);
      let projection = this.projection.get(item);
      if (!projection) {
        projection = { pixelX: NaN, pixelY: NaN };
        this.projection.set(item, projection);
      }
      const inFrustum = this.frustum.containsPoint(vector);
      if (inFrustum) this.frustumIndices.add(idx);
      else {
        this.frustumIndices.delete(idx);
      }
      if (inFrustum) {
        vector.project(this.camera);
        projection.pixelX = Math.round(vector.x * halfW + halfW);
        projection.pixelY = Math.round(-vector.y * halfH + halfH);
      } else {
        projection.pixelX = projection.pixelY = NaN;
      }
      return { x: projection.pixelX, y: projection.pixelY };
    };

    this.cloudData.forEach((pt, idx) => {
      toScreen(pt, idx);
    });
  }

  dispose() {
    this.scene.clear();
    this.camera.clear();
    this.controls.dispose();
    this.renderer.dispose();
    this.renderer
      .getContext()
      .getExtension("WEBGL_lose_context")
      ?.loseContext();
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);
    this.render();
  }

  onMouseMove = (e: MouseEvent) => {
    const { left, top } = this.container.getBoundingClientRect();

    this.pointer.x = ((e.pageX - left) / this.width) * 2 - 1;
    this.pointer.y = -((e.pageY - top) / this.height) * 2 + 1;
  };

  setPointSize(size: number) {
    this.pointSize = size;
    // @ts-ignore
    this.cloudObject.material.size = size;
    this.render();
  }

  setShaderMode(mode: IShaderMode) {
    this.shaderMode = mode;
    const colors: number[] = [];
    if (this.pcd?.label) {
      this.pcd.label.forEach((v, i) => {
        if (this.cloudData[i]) {
          this.cloudData[i].labelIndex = v;
          const rgb = hex2rgb(this.getPointColor(i));
          colors.push(rgb[0], rgb[1], rgb[2]);
        }
      });
    }
    // const
    this.cloudObject.geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );
    this.render();
  }

  setViewMode(mode: "3d" | "top") {
    this.cameraMode = mode === "3d" ? "perspective" : "orthographic";
    this.initCamera();
    this.render();
    this.moveCamera();
  }
}
